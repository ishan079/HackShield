import type { MiniSprintDto, MiniSprintRegistrationDto, MiniSprintRegistrationRequest } from '@/types/api'

export interface MiniSprintRegistrationStore {
  list(): Promise<MiniSprintDto[]>
  register(
    sprintId: string,
    input: MiniSprintRegistrationRequest
  ): Promise<MiniSprintRegistrationDto>
}
