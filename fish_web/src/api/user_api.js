import { get, post } from './http'

const url= '/api/users'
/**
 * 登录
 */
export const UserLogin = (params) => {
    return post(url+'/user_login', params)
}

/**
 * 注册
 */
export const UserRegister = (params) => {
    return post(url+'/user_register', params)
}

/**
 * 根据token获取用户信息
 */
export const SelectUserByToken = (params) => {
    return post(url+'/select_user_by_token', params)
}

/**
 * 查询所有用户
 */
export const SelectAllUser = (params) => {
    return post(url+'/get_all_user', params)
}

/**
 * 根据id获取用户信息
 */
export const SelectUserById = (params) => {
    return get(url+'/select_user_by_id', params)
}

/**
 * 验证用户名
 */
export const VerifyUserName = (params) => {
    return get(url+'/verify_user_name', params)
}

/**
 * 根据用户名查询用户
 */
export const SelectUserByUserName = (params) => {
    return post(url+'/select_user_by_user_name', params)
}


/**
 * 修改个人信息
 */
export const UpdateUserById = (params) => {
    return post(url+'/update_user_by_id', params)
}

