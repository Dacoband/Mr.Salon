import React, { useEffect, useState, CSSProperties } from 'react';
import { Modal, Button, Input, Form, Spin } from 'antd';
import { fetchUserData, updateUserData } from '../../services/ProfileAll';
import { UserInfoData } from '../../models/type';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserInfoData | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | File>();
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const userDataString = localStorage.getItem("userData");
  const userDatas = userDataString ? JSON.parse(userDataString) : null;
  const [editData, setEditData] = useState<UserInfoData | null>(null);
  const role = userDatas?.roleName;
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const data = await fetchUserData(userDatas?.actorId, userDatas?.email);
        setUserData(data);
        setEditData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userDatas?.actorId]);

  const handleChange = (field: keyof UserInfoData, value: string) => {
    setEditData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarImage(e.target.files[0]); 
    }
  };
  const getImageSrc = () => {
    const avatarImage = userData?.avatarImage;
    if (avatarImage instanceof File) {
      return URL.createObjectURL(avatarImage);
    }
   
    return avatarImage || '../../assets/images/demo.jpg';
  };

  const handleSave = async () => {
    if (editData) {
      try {
        await updateUserData(userDatas?.actorId, { ...editData, avatarImage }); 
        setUserData(editData); 
        setIsModalOpen(false); 
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          const validationErrors = error.response.data.errors;
          if (validationErrors) {
            const formattedErrors: Record<string, string[]> = {};
            for (const field in validationErrors) {
              formattedErrors[field] = validationErrors[field];
            }
            setApiErrors(formattedErrors);
          }
        } else {
          console.error('An unexpected error occurred:', error.message);
          alert('An unexpected error occurred. Please try again later.');
        }
      }
    }
  };

  const showEditModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!userData) {
    return <div style={styles.error}>Không tìm thấy.</div>;
  }

  return (
    <main role="main" style={styles.profileMain}>
      <div style={styles.contentContainer}>
       
          <div style={styles.profileImage}>
            <img src={getImageSrc()} alt="Profile" style={styles.image} />
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.greeting}>Xin chào, {userData.MemberName || 'User Name'}!</h2>
            <h4 style={styles.role}>{role || 'User Role'}</h4>
          </div>
       

        <div style={styles.userInfo}>
          <div style={styles.infoColumn}>
            <h4>Email:</h4>
            <p>{userDatas?.email || 'user@example.com'}</p>
          </div>
          <div style={styles.infoColumn}>
            <h4>Số điện thoại:</h4>
            <p>{userData.PhoneNumber || '(+00) 0000 0000'}</p>
          </div>
          <div style={styles.infoColumn}>
            <h4>Ngày sinh:</h4>
            <p>{userData.DateOfBirth ? new Date(userData.DateOfBirth).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div style={styles.infoColumn}>
            <h4>Địa chỉ:</h4>
            <p>{userData.Address || 'City, Country'}</p>
          </div>
        </div>
      </div>
      <Button style={styles.editbtn} onClick={showEditModal}>
        🛠️ Chỉnh sửa
      </Button>

      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        visible={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Tên">
            <Input
              value={editData?.MemberName}
              onChange={(e) => handleChange('MemberName', e.target.value)}
            />
            {apiErrors.MemberName && <span className="error-message">{apiErrors.MemberName[0]}</span>}
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={editData?.Email}
              onChange={(e) => handleChange('Email', e.target.value)}
            />
            {apiErrors.Email && <span className="error-message">{apiErrors.Email[0]}</span>}
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input
              value={editData?.PhoneNumber}
              onChange={(e) => handleChange('PhoneNumber', e.target.value)}
            />
            {apiErrors.PhoneNumber && <span className="error-message">{apiErrors.PhoneNumber[0]}</span>}
          </Form.Item>
          <Form.Item label="Ngày sinh">
            <Input
              value={editData?.DateOfBirth}
              onChange={(e) => handleChange('DateOfBirth', e.target.value)}
            />
            {apiErrors.DateOfBirth && <span className="error-message">{apiErrors.DateOfBirth[0]}</span>}
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
              value={editData?.Address}
              onChange={(e) => handleChange('Address', e.target.value)}
            />
            {apiErrors.Address && <span className="error-message">{apiErrors.Address[0]}</span>}
          </Form.Item>
          <label htmlFor="AvatarImage">Hình đại diện</label>
          <input
            type="file"
            name="AvatarImage"
            onChange={handleFileChange}
            className="input-style"
          />
          {apiErrors.AvatarImage && apiErrors.AvatarImage.map((error, index) => (
            <span key={index} className="error-message">{error}</span>
          ))}
        </Form>
      </Modal>
    </main>
  );
};

const styles: { [key: string]: CSSProperties } = {
  profileMain: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px',
    justifyContent: 'center',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '700px',
  },
  profileImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e0e0e0',
  },
  profileInfo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  greeting: {
    fontSize: '1.6em',
    color: '#333',
    marginBottom: '0.2em',
  },
  role: {
    fontSize: '1em',
    fontWeight: 'normal',
    color: '#888',
  },
  userInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  infoColumn: {
    backgroundColor: '#fafafa',
    padding: '10px 15px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5em',
    color: '#777',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: '1.2em',
  },
  editbtn: {
    display: 'block',
    margin: '0 auto',
    backgroundColor: '#1890ff',
    color: '#fff',
    padding: '0.8em 2em',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1.1em',
  },
};

export default Profile;
