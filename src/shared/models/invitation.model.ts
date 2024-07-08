export type PlayerState = "RECEIVED_INVITE" | "ACCEPTED" | "REJECTED"

export interface Invitation {
    id: string
    receiver: string
    state: PlayerState
}
