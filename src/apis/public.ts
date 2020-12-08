import { Post } from '../axios/axios'
import {Public} from '../interface/index';
export const login = (data: Public.login) => Post('User/Login', data)