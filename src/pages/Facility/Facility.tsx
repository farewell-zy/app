import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IFormTable, IFormTableOperation, IMessage, SearchWrapper } from '@/components'
import { columns, forms } from './config'
import { message, type FormInstance, Button } from 'antd'
import { useGetEquipmentList } from '@/hooks'
import { type Equipment } from '@/types'
import { equipmentApi } from '@/api'
import { PlusOutlined } from '@ant-design/icons'
import FacilityEditForm from './components/EditForm'
import { useGlobalContext } from '@/layout/context'

interface IProps {
  inside?: boolean
}

const EquipmentCom: React.FC<IProps> = ({ inside = false }) => {
  const formRef = useRef<FormInstance<any>>()
  const { equipmentTypeConfig } = useGlobalContext()

  const [formVisible, setFormVisible] = useState(false)
  const [messageVisible, setMessageVisible] = useState(false)
  const [data, setData] = useState<Equipment | Record<string, any>>()
  const [updateloading, setUpdateLoading] = useState(false)

  const { pagination, list, loading, getEquipmentList } = useGetEquipmentList()

  const onReload = async (params?: Record<string, any>) => {
    await getEquipmentList({ ...formRef.current?.getFieldsValue(), current: 1, ...params, inside })
  }

  const viewFn = (record: Equipment) => {
    setData({
      ...record,
      price_per_day: Number(record?.price_per_day) / 100
    })
    setMessageVisible(true)
  }

  const editFn = (record?: Equipment) => {
    setData({
      ...record,
      price_per_day: Number(record?.price_per_day) / 100
    })
    setFormVisible(true)
  }

  const deleteFn = async (record: Equipment) => equipmentApi.deleteEquipment({ id: record?.ID })

  const handleSubmit = async (values: Equipment) => {
    const { price_per_day: pricePerDay, ...params } = values ?? {}
    setUpdateLoading(true)
    try {
      await equipmentApi.updateEquipment({
        ...params,
        price_per_day: pricePerDay ? pricePerDay * 100 : undefined,
        inside,
        id: data?.ID
      })
      setFormVisible(false)
      message.success('操作成功')
      onReload()
    } catch (error) {
      message.error('操作失败')
    } finally {
      setUpdateLoading(false)
    }
  }

  const tableColumns = useMemo(() => columns.concat([{
    title: '操作',
    width: 180,
    dataIndex: 'operation',
    render: (_: any, record, index: number) => IFormTableOperation({ record, viewFn, deleteFn, editFn, onReload, text: record?.equipment_model })
  }]), [])

  useEffect(() => {
    onReload()
  }, [])

  return (
    <>
      <IFormTable
        form={{
          forms,
          search: true,
          loading,
          getFormRef: form => {
            formRef.current = form
          },
          formProps: {
            onFinish: onReload
          },
          render: Forms => <SearchWrapper Forms={Forms} ButtonGroup={<Button type='primary' icon={<PlusOutlined />} onClick={() => { editFn() }}>添加信息</Button>} />
        }}
        table={{
          columns: tableColumns,
          dataSource: list?.map(i => ({ ...i, equipmentTypeConfig })) || [],
          loading,
          pagination: {
            ...pagination,
            onChange: (current: number, pageSize: number) => {
              onReload({ current, pageSize })
            }
          }
        }}
      />
      {formVisible && <FacilityEditForm data={data} loading={updateloading} inside={inside} onOk={handleSubmit} onCancel={() => { setFormVisible(false) }} />}
      <IMessage
        visible={messageVisible}
        data={[
          { label: '设备类型', value: equipmentTypeConfig?.map[data?.type] },
          { label: '设备型号', value: data?.equipment_model },
          { label: '设备编号', value: data?.serial_number },
          { label: '设备个数', value: data?.quantity },
          { label: '单价(元)/天', value: data?.price_per_day }
        ]}
        onCancel={() => { setMessageVisible(false) }}
      />
    </>
  )
}

export default EquipmentCom
