export const appointmentIdMaker = (id: number) => {
  return 'APT' + String(id).padStart(11, '0')
}

export const orderIdMaker = (id: number) => {
  return 'ORDER-' + String(id).padStart(11, '0')
}
