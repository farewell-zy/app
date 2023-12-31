import { type EComponentType } from '@/enums/componentType'
import type { FormInstance, FormItemProps, FormProps, FormRule } from 'antd'
import { type ReactNode } from 'react'

export type ItemRender = (config: Record<string, any>, component?: JSX.Element) => any
export type ItemsRender = (components?: JSX.Element[]) => any
export interface IFormItemProps extends FormItemProps {
  key: string
  label?: string | ReactNode
  type: EComponentType
  props?: Record<string, any>
  name?: string
  placeholder?: string
  rules?: FormRule[]
  /** 需要传入容器组件为Form.Item的组件内容 */
  customRender?: () => JSX.Element
  itemRender?: ItemRender
  items?: IFormItemProps[]
  inside?: boolean
  rowConfig?: {
    span?: number
    push?: number
  }
}

export interface IFormProps extends FormProps {
  forms: IFormItemProps[]
  formProps?: FormProps
  search?: boolean
  // 默认平铺
  tiling?: boolean
  // 多种渲染方式
  multipleForms?: IFormItemProps[][]
  render?: (components?: JSX.Element[]) => any
  extraValues?: Record<string, any>
  loading?: boolean
  onSearch?: (params?: Record<string, any>) => any
  getFormRef?: (a: FormInstance<any>) => any
  inside?: boolean
}

export type ITableProps = Record<string, any>

export interface IFormTableProps {
  form: IFormProps
  table: ITableProps
}

export interface NumberRadiusProps {
  form?: FormInstance<any>
  items?: IFormItemProps[]
  props?: Record<string, any>
}
