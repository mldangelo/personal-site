import type React from 'react';
import { Space, Button, Tooltip, theme } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from '../../data/contact';

const ContactIcons: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Space wrap size="middle" style={{ width: '100%', justifyContent: 'center' }}>
      {data.map((s) => (
        <Tooltip key={s.label} title={s.label}>
          <Button
            type="text"
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            icon={
              <FontAwesomeIcon
                icon={s.icon}
                style={{
                  fontSize: token.fontSizeLG,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            }
            size="large"
            style={{
              width: 48,
              height: 48,
              borderRadius: token.borderRadiusLG,
            }}
          />
        </Tooltip>
      ))}
    </Space>
  );
};

export default ContactIcons;
