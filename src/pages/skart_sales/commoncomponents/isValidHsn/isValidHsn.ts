export const isValidHsn = (inputString: string) => {
    const invalidStrings = [
        "00000000",
        "11111111",
        "22222222",
        "33333333",
        "44444444",
        "55555555",
        "66666666",
        "77777777",
        "88888888",
        "99999999",
        "01234567",
        "12345678",
        "23456789",
        "34567890",
        "45678901",
        "56789012",
        "67890123",
        "78901234",
        "89012345",
        "90123456",
    ];

    if (inputString.length >= 6) {
        if (/^[0-9]+$/.test(inputString)) {
            if (invalidStrings.includes(inputString)) {
                // console.log("Invalid HSN Code");
                return false;
            } else {
                // console.log("Valid HSN Code");
                return true;
            }
        } else {
            // console.log("Invalid HSN Code");
            return false;
        }
    } else {
        // console.log("Invalid HSN Code");
        return false;
    }
}