import IForm from '@/components/IForm'
import { EComponentType } from '@/enums'
import { type FormInstance } from 'antd'
import { useMemo, useRef } from 'react'
import IModal from '@/components/IModal'
import { type IFormProps } from '@/components/type'
import { BankOptions, LevelOptions } from '@/config'

interface IProps {
  data?: any
  onOk: (value: any) => void
  onCancel: () => void
  loading: boolean
  inside?: boolean
}

const multipleForms: IFormProps['multipleForms'] = [
  [
    {
      type: EComponentType.Input,
      label: '姓名',
      key: 'name',
      props: { placeholder: '请输入名字' }
    },
    {
      type: EComponentType.CompanySelect,
      label: '公司',
      key: 'company_id',
      props: { placeholder: '请选择公司' }
    }
  ],
  [
    {
      type: EComponentType.Input,
      label: '所属团队',
      key: 'department',
      props: { placeholder: '请输入团队' }
    },
    {
      type: EComponentType.RoleSelect,
      label: '角色',
      key: 'role',
      props: { placeholder: '请选择角色' }
    }
  ],
  [
    {
      type: EComponentType.Select,
      label: '级别',
      key: 'level',
      props: { options: LevelOptions, placeholder: '请选择级别' }
    },
    {
      type: EComponentType.FieldSelect,
      label: '视频领域',
      key: 'field',
      props: { placeholder: '请选择视频领域', mode: 'multiple' }
    }
  ],
  [
    {
      type: EComponentType.Input,
      label: '身份证',
      key: 'id_card',
      props: { placeholder: '请输入身份证' }
    },
    {
      type: EComponentType.Input,
      label: '手机号',
      key: 'phone_number',
      props: { placeholder: '请输入手机号' }
    }
  ],
  [
    {
      type: EComponentType.BankSelect,
      label: '银行卡',
      key: 'bank_branch',
      props: { placeholder: '请选择银行' }
    },
    {
      type: EComponentType.Input,
      label: '银行帐号',
      key: 'bank_account',
      props: { options: BankOptions, placeholder: '请输入银行帐号' }
    }
  ],
  [
    {
      type: EComponentType.Input,
      label: '紧急联系人',
      key: 'emergency_contact_name',
      props: { placeholder: '请输入紧急联系人' }
    },
    {
      type: EComponentType.Input,
      label: '联系人电话',
      key: 'emergency_contact_phone',
      props: { placeholder: '请输入联系人电话' }
    }
  ]
].map(arr => arr.map(config => ({
  ...config,
  rules: [{ required: true, message: config?.props?.placeholder }],
  validateTrigger: 'onBlur'
})))

export default function PersonelEditForm (props: IProps) {
  const { data, onOk, onCancel, loading, inside } = props || {}

  const isEdit = useMemo(() => Boolean(data?.id), [])

  const formRef = useRef<FormInstance>(null)

  const onFinish = async () => {
    try {
      if (!formRef.current) return
      const pass = await formRef.current.validateFields()
      if (!pass) return
      onOk(formRef.current.getFieldsValue())
    } catch (e) { }
  }

  return (
    <IModal onCancel={onCancel} onOk={onFinish} isEdit={isEdit} confirmLoading={loading}>
      <IForm
        tiling={false}
        ref={formRef}
        formProps={{
          labelCol: { span: 6 },
          initialValues: data || {}
        }}
        forms={[]}
        multipleForms={multipleForms}
        inside={inside}
      />
    </IModal>

  )
}
