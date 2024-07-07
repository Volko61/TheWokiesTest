    export type PlayerState = "RECEIVED_INVITE" | "ACCEPTED" | "REJECTED"

export interface Player {
    id: string
    name: string
    mail: string
    state: PlayerState
}
