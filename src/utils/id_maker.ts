// membuat ID janji temu dengan format 'APT' diikuti oleh angka ID yang di-padding menjadi 11 digit dengan angka 0 di depan jika diperlukan.
export const appointmentIdMaker = (id: number) => {
  return 'APT' + String(id).padStart(11, '0')
}

// membuat ID pesanan dengan format 'ORDER-' diikuti oleh angka ID yang di-padding menjadi 11 digit dengan angka 0 di depan jika diperlukan.
export const orderIdMaker = (id: number) => {
  return 'ORDER-' + String(id).padStart(11, '0')
}
