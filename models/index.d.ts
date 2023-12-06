import {
  InferAttributes,
  InferCreationAttributes,
  ModelDefined,
} from 'sequelize'
import { USER } from '../src/types/user'

declare const User: User &
  ModelDefined<InferAttributes<USER>, InferCreationAttributes<USER>>
declare const User: User &
  ModelDefined<InferAttributes<USER>, InferCreationAttributes<USER>>

module.exports = {
  User,
}
