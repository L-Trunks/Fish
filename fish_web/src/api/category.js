import { get, post } from './http'

const url = '/api/category'

/**
 * 添加分类
 */
export const AddCategory = (params) => {
    return post(url+'/add_category',params)
}

/**
 * 删除分类
 */
export const DeleteCategory = (params) => {
    return get(url+'/delete_category',params)
}

/**
 * 修改分类
 */
export const UpdateCategory = (params) => {
    return post(url+'/update_category',params)
}

/**
 * 查询所有分类
 */
export const SelectAllCategory = (params) => {
    return get(url+'/select_all_category',params)
}

/**
 * 根据id查询分类
 */
export const SelectCategoryById = (params) => {
    return get(url+'/select_category_by_id',params)
}

/**
 * 根据类型查询分类
 */
export const SelectCategoryByType = (params) => {
    return get(url+'/select_category_by_type',params)
}

/**
 * 根据用户查询分类
 */
export const SelectCategoryByUser = (params) => {
    return get(url+'/select_category_by_user',params)
}
