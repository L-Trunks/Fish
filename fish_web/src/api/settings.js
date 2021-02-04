import { get, post } from './http'

const url = '/api/settings'
/**
 * 添加设置（公告或轮播图信息）
 */
export const AddSettings = (params) => {
    return post(url+'/add_settings',params)
}

/**
 * 删除设置
 */
export const DeleteSettings = (params) => {
    return get(url+'/delete_settings',params)
}

/**
 * 修改设置（公告或轮播图信息）
 */
export const UpdateSettings = (params) => {
    return post(url+'/update_settings',params)
}

/**
 * 根据类型查询设置信息
 */
export const SelectSettingsByType = (params) => {
    return get(url+'/select_settings_by_type',params)
}

/**
 * 根据id查询设置信息
 */
export const SelectSettingsById = (params) => {
    return get(url+'/select_settings_by_id',params)
}

/**
 * 查询所有设置信息
 */
export const SelectAllSettings = (params) => {
    return get(url+'/select_all_settings',params)
}