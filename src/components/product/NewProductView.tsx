import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import toast from "react-hot-toast";
import { Product } from "@/types";
import ProductDetailLayout from "./templates/ProductDetailLayout";

// --- TYPE DEFINITIONS ---
interface MetadataItem {
  key: string;
  value: string;
}

interface VariantAttribute {
  attribute: { name: string };
  values: { name: string }[];
}

interface Variant {
  id: string;
  name: string;
  quantityAvailable: number;
  pricing: {
    price: {
      gross: {
        amount: number;
        currency: string;
      };
    };
    priceUndiscounted: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  };
  attributes: VariantAttribute[];
  metadata: MetadataItem[];
  // ✅ FIX: Added media array to capture variant-specific images
  media?: { url: string; alt?: string }[];
}

interface ProductViewProps {
  product: Product & {
    images: { id: string; url: string; alt: string }[];
    variants: Variant[];
    seoDescription?: string;
    description: string;
    metadata: MetadataItem[];
  };
}

// ✅ FIX: Get attributes dynamically by position, not by hardcoded names ("OS")
const getAttributeByIndex = (
  variant: Variant,
  index: number
): string | undefined => {
  return variant.attributes[index]?.values[0]?.name;
};

export default function NewProductView({ product }: ProductViewProps) {
  const [searchParams] = useSearchParams();
  const { addItem, toggleCart } = useCart();
  const navigate = useNavigate();

  // --- VARIANT LOGIC ---
  const { variantOptions, variantMap } = useMemo(() => {
    const options: Record<string, string[]> = {};
    const map: Record<string, Variant> = {};

    product.variants.forEach((variant) => {
      // ✅ FIX: Grab 1st and 2nd attributes dynamically so it works for ALL products
      const primaryAttr = getAttributeByIndex(variant, 0);
      const secondaryAttr = getAttributeByIndex(variant, 1) || "Default";

      if (primaryAttr) {
        if (!options[primaryAttr]) {
          options[primaryAttr] = [];
        }
        if (!options[primaryAttr].includes(secondaryAttr)) {
          options[primaryAttr].push(secondaryAttr);
        }
        map[`${primaryAttr}_${secondaryAttr}`] = variant;
      }
    });
    return { variantOptions: options, variantMap: map };
  }, [product.variants]);

  const osOptions = useMemo(() => Object.keys(variantOptions), [variantOptions]);

  const getInitialVariant = () => {
    const variantIdFromUrl = searchParams.get("variant");
    if (variantIdFromUrl) {
      const foundVariant = product.variants.find(
        (v) => v.id === variantIdFromUrl
      );
      if (foundVariant) {
        return foundVariant;
      }
    }
    return product.variants[0] || null;
  };

  const initialVariant = getInitialVariant();

  const initialOS = initialVariant
    ? getAttributeByIndex(initialVariant, 0)
    : osOptions[0];

  const initialScreenType = initialVariant
    ? getAttributeByIndex(initialVariant, 1) || "Default"
    : undefined;

  const [selectedOS, setSelectedOS] = useState<string | undefined>(initialOS);
  const [selectedScreenType, setSelectedScreenType] = useState<string | undefined>(initialScreenType);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(initialVariant);

  const availableScreenTypes = useMemo(() => {
    return selectedOS ? variantOptions[selectedOS] || [] : [];
  }, [selectedOS, variantOptions]);

  useEffect(() => {
    if (selectedOS && selectedScreenType) {
      const variant = variantMap[`${selectedOS}_${selectedScreenType}`];
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  }, [selectedOS, selectedScreenType, variantMap]);

  useEffect(() => {
    if (
      selectedOS &&
      !availableScreenTypes.includes(selectedScreenType as string)
    ) {
      setSelectedScreenType(availableScreenTypes[0]);
    }
  }, [selectedOS, availableScreenTypes, selectedScreenType]);

  // --- IMAGE LOGIC (FIXED) ---
  // ✅ FIX: Prioritize variant media. Fallback to general product images if none exist.
  const displayImages = useMemo(() => {
    if (selectedVariant?.media && selectedVariant.media.length > 0) {
      return selectedVariant.media;
    }
    return product.images || [];
  }, [selectedVariant, product.images]);

  // --- PRICE & CART LOGIC ---
  const price = selectedVariant?.pricing.price.gross.amount || 0;
  const listPrice = selectedVariant?.pricing.priceUndiscounted.gross.amount || 0;
  const currency = selectedVariant?.pricing.price.gross.currency || "INR";
  const quantityAvailable = selectedVariant?.quantityAvailable || 0;

  const handleAddToCart = (): boolean => {
    if (!selectedVariant) {
      toast.error("Please select all variant options");
      return false;
    }
    if (selectedVariant.quantityAvailable <= 0) {
      toast.error("Sorry, this item is out of stock");
      return false;
    }

    addItem({
      id: selectedVariant.id,
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: price,
      quantity: 1,
      thumbnail: displayImages[0]?.url || "",
      variant: {
        name: selectedVariant.name,
        attributes: selectedVariant.attributes.reduce(
          (acc: any, attr: any) => {
            acc[attr.attribute.name] = attr.values[0]?.name || "";
            return acc;
          },
          {} as Record<string, string>
        ),
      },
    });
    return true;
  };

  const handleAddToCartAndNotify = () => {
    const success = handleAddToCart();
    if (success) {
      toast.success("Added to cart!");
      toggleCart();
    }
  };

  const handleBuyNow = () => {
    const success = handleAddToCart();
    if (success) {
      setTimeout(() => {
        navigate('/checkout');
      }, 100);
    }
  };

  // --- SPECS LOGIC ---
  const specifications = useMemo(() => {
    const attrs = selectedVariant ? selectedVariant.attributes.map((attr: VariantAttribute) => ({
      label: attr.attribute.name,
      value: attr.values.map((val: any) => val.name).join(", "),
    })) : [];

    const productMeta = Array.isArray(product.metadata)
      ? product.metadata.map((item: MetadataItem) => ({
        label: item.key,
        value: item.value,
      }))
      : [];

    const variantMeta = (selectedVariant && Array.isArray(selectedVariant.metadata))
      ? selectedVariant.metadata.map((item: MetadataItem) => ({
        label: item.key,
        value: item.value,
      }))
      : [];

    return [...attrs, ...productMeta, ...variantMeta];
  }, [selectedVariant, product.metadata]);

  return (
    <ProductDetailLayout
      productName={product.name}
      productDescription={product.description}
      // ✅ Passing the correctly prioritized images
      productImages={displayImages}

      price={price}
      listPrice={listPrice}
      currency={currency}
      specifications={specifications}
      quantityAvailable={quantityAvailable}

      osOptions={osOptions}
      selectedOS={selectedOS}
      // Filter out the "Default" fallback so we don't render a dummy button
      availableScreenTypes={availableScreenTypes.filter(t => t !== "Default")}
      selectedScreenType={selectedScreenType}
      variantMap={variantMap}

      onOSSelect={setSelectedOS}
      onScreenTypeSelect={setSelectedScreenType}
      onBuyNow={handleBuyNow}
      onAddToCart={handleAddToCartAndNotify}
    />
  );
}