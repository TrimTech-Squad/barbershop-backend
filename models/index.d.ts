import {
  InferAttributes,
  InferCreationAttributes,
  ModelDefined,
} from 'sequelize'
import { USER } from '../../types/user'
import { APPOINTMENT } from '../../types/appointment'
import { KAPSTER } from '../../types/kapster'
import { SERVICE, ServiceKapster } from '../../types/service'

declare const User: USER &
  ModelDefined<InferAttributes<USER>, InferCreationAttributes<USER>>
declare const Appointment: APPOINTMENT &
  ModelDefined<
    InferAttributes<APPOINTMENT>,
    InferCreationAttributes<APPOINTMENT>
  >
declare const Kapster: KAPSTER &
  ModelDefined<InferAttributes<KAPSTER>, InferCreationAttributes<KAPSTER>>
declare const Service: SERVICE &
  ModelDefined<InferAttributes<SERVICE>, InferCreationAttributes<SERVICE>>
declare const ServiceKapster: SERVICE_KAPSTER &
  ModelDefined<
    InferAttributes<SERVICE_KAPSTER>,
    InferCreationAttributes<SERVICE_KAPSTER>
  >

module.exports = {
  User,
  Appointment,
  Kapster,
  Service,
  ServiceKapster,
}
