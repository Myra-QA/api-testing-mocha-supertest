export function validCartPayload() {
    return {
        userId: 6,
        products: [
            {
                id: 1,
                quantity: 2
            },
            {
                id: 2,
                quantity: 1
            }
        ]
    };
}

export function invalidCartPayload() {
    return {
        products: [
            {
                id: 1,
                quantity: 2
            },
            {
                id: 2,
                quantity: 1
            }
        ]
    };
}

export function updateCartPayload() {
    return {
        merge: false,
        products: [
            {id: 1,quantity: 3},
            {id: 2, quantity: 5 }
        ]
    };

}

export function invalidProductCartPayload() {
    return {
        userId: 6,
        products: [
            {
                id: 9999,
                quantity: 1
            }
        ]
    };
}

export function minimumQuantityCartPayload() {
    return {
        userId: 6,
        products: [
            {
                id: 1,
                quantity: 1
            }

        ]

    }
}