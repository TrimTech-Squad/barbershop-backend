export const appointmentIdMaker = (id: number) => {
  return 'APT' + String(id).padStart(11, '0')
}
