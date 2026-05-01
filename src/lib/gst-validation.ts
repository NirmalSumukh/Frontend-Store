/**
 * GST Validation Service
 * 
 * Structure ready for real-time GST API integration
 * Replace validateGSTFormat with actual API call when ready
 */

export interface GSTValidationResult {
    isValid: boolean
    message: string
    details?: {
        businessName?: string
        registrationDate?: string
        status?: 'Active' | 'Cancelled' | 'Suspended'
        address?: string
    }
}

/**
 * Validates GST number format (15 characters)
 * Format: 22AAAAA0000A1Z5
 * 
 * @param gstNumber - The GST number to validate
 * @returns Promise<GSTValidationResult>
 */
export const validateGSTNumber = async (
    gstNumber: string
): Promise<GSTValidationResult> => {
    // Basic format validation
    const formatValidation = validateGSTFormat(gstNumber)
    if (!formatValidation.isValid) {
        return formatValidation
    }

    // ✅ TODO: Replace with actual GST API integration
    // Example: https://services.gst.gov.in/services/api/search
    // or third-party services like GST Verify API

    try {
        // Placeholder for future API call
        // const response = await fetch(`${import.meta.env.VITE_GST_API_URL}/verify`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ gstNumber })
        // })
        // const data = await response.json()

        // For now, simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            isValid: true,
            message: 'GST number format is valid',
            details: {
                businessName: 'Placeholder Business Name',
                status: 'Active',
            }
        }
    } catch (error) {
        console.error('GST validation error:', error)
        return {
            isValid: false,
            message: 'Unable to verify GST number. Please try again.',
        }
    }
}

/**
 * Validates GST number format only (offline check)
 */
export const validateGSTFormat = (gstNumber: string): GSTValidationResult => {
    if (!gstNumber) {
        return { isValid: false, message: 'GST number is required' }
    }

    // Remove spaces and convert to uppercase
    const cleanGST = gstNumber.replace(/\s/g, '').toUpperCase()

    // Check length
    if (cleanGST.length !== 15) {
        return {
            isValid: false,
            message: 'GST number must be exactly 15 characters',
        }
    }

    // GST format regex: 
    // - First 2 digits: State code (01-37)
    // - Next 10 characters: PAN
    // - 13th character: Entity number
    // - 14th character: 'Z' by default
    // - 15th character: Check digit
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

    if (!gstRegex.test(cleanGST)) {
        return {
            isValid: false,
            message: 'Invalid GST number format',
        }
    }

    return {
        isValid: true,
        message: 'GST number format is valid',
    }
}

/**
 * Extracts state code from GST number
 */
export const getStateFromGST = (gstNumber: string): string | null => {
    const cleanGST = gstNumber.replace(/\s/g, '').toUpperCase()
    if (cleanGST.length !== 15) return null

    const stateCode = cleanGST.substring(0, 2)
    const stateMap: Record<string, string> = {
        '01': 'Jammu and Kashmir',
        '02': 'Himachal Pradesh',
        '03': 'Punjab',
        '04': 'Chandigarh',
        '05': 'Uttarakhand',
        '06': 'Haryana',
        '07': 'Delhi',
        '08': 'Rajasthan',
        '09': 'Uttar Pradesh',
        '10': 'Bihar',
        '11': 'Sikkim',
        '12': 'Arunachal Pradesh',
        '13': 'Nagaland',
        '14': 'Manipur',
        '15': 'Mizoram',
        '16': 'Tripura',
        '17': 'Meghalaya',
        '18': 'Assam',
        '19': 'West Bengal',
        '20': 'Jharkhand',
        '21': 'Odisha',
        '22': 'Chhattisgarh',
        '23': 'Madhya Pradesh',
        '24': 'Gujarat',
        '27': 'Maharashtra',
        '29': 'Karnataka',
        '32': 'Kerala',
        '33': 'Tamil Nadu',
        '36': 'Telangana',
        '37': 'Andhra Pradesh',
    }

    return stateMap[stateCode] || null
}
