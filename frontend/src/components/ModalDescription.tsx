import { Descriptions } from "antd";

interface DetailIF {
    label: string;
    value: any;
}

const ModalDescription = (prop: any) => {
  const object: DetailIF[] = prop.object;
  return (
    <Descriptions
      bordered
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
    >
      {object.map((item: any, i) => {
        return (
          <Descriptions.Item key={i} label={item.label}>{item.value}</Descriptions.Item>
        );
      })}
    </Descriptions>
  );
};

export default ModalDescription;
