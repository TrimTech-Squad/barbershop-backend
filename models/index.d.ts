import {
  InferAttributes,
  InferCreationAttributes,
  ModelDefined,
} from 'sequelize'
import { USER } from '../../types/user'
import { APPOINTMENT } from '../../types/appointment'
import { KAPSTER } from '../../types/kapster'
import { SERVICE, ServiceKapster } from '../../types/service'
import { ORDER } from '../types/order'

// Deklarasi konstanta User dan memberikan tipe data menggunakan ModelDefined dari Sequelize
declare const User: USER &
  ModelDefined<InferAttributes<USER>, InferCreationAttributes<USER>>

// Deklarasi konstanta Appointment dan memberikan tipe data menggunakan ModelDefined dari Sequelize
declare const Appointment: APPOINTMENT &
  ModelDefined<
    InferAttributes<APPOINTMENT>,
    InferCreationAttributes<APPOINTMENT>
  >

// Deklarasi konstanta Kapster dan memberikan tipe data menggunakan ModelDefined dari Sequelize
declare const Kapster: KAPSTER &
  ModelDefined<InferAttributes<KAPSTER>, InferCreationAttributes<KAPSTER>>

// Deklarasi konstanta Service dan memberikan tipe data menggunakan ModelDefined dari Sequelize
declare const Service: SERVICE &
  ModelDefined<InferAttributes<SERVICE>, InferCreationAttributes<SERVICE>>

// Deklarasi konstanta ServiceKapster dan memberikan tipe data menggunakan ModelDefined dari Sequelize
declare const ServiceKapster: SERVICE_KAPSTER &
  ModelDefined<
    InferAttributes<SERVICE_KAPSTER>,
    InferCreationAttributes<SERVICE_KAPSTER>
  >

// Deklarasi konstanta  Order dan memberikan tipe data menggunakan ModelDefined dari Sequelize
declare const Order: ORDER &
  ModelDefined<InferAttributes<ORDER>, InferCreationAttributes<ORDER>>

module.exports = {
  User,
  Appointment,
  Kapster,
  Service,
  ServiceKapster,
  Order,
}
