import {
  InferAttributes,
  InferCreationAttributes,
  ModelDefined,
} from 'sequelize'
import { USER } from '../src/types/user'
import { APPOINTMENT } from '../src/types/appointment'
import { KAPSTER } from '../src/types/kapster'
import { SERVICE, SERVICE_KAPSTER } from '../src/types/service'

declare const User: User &
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
declare const Service_Kapster: SERVICE_KAPSTER &
  ModelDefined<
    InferAttributes<SERVICE_KAPSTER>,
    InferCreationAttributes<SERVICE_KAPSTER>
  >

module.exports = {
  User,
  Appointment,
  Kapster,
  Service,
}
