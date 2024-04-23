export interface User {
    username: string,
    password: string
}

export interface Token {
    username: string,
    token: string,
    photoUrl: string,
    knownAs: string,
    gender: string,
    roles: string[]
}

export interface Register {
    username: string,
    password: string
}