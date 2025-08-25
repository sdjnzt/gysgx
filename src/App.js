import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 导入布局组件
import MainLayout from './layouts/MainLayout';

// 导入页面组件
import Login from './pages/Login';
import SRMDashboard from './pages/SRMDashboard';
import SupplierBaseInfo from './pages/SupplierBaseInfo';
import DataPreprocessing from './pages/DataPreprocessing';
import QualificationManagement from './pages/QualificationManagement';
import CategoryGrading from './pages/CategoryGrading';
import PurchaseOrderManagement from './pages/PurchaseOrderManagement';
 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 处理登录
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  // 处理登出
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  // 私有路由组件
  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* 登录页面 */}
        <Route 
          path="/login" 
          element={
            isLoggedIn 
              ? <Navigate to="/srm" /> 
              : <Login onLogin={handleLogin} />
          } 
        />
        
        {/* 主应用路由 → 指向 SRM 总览 */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <MainLayout onLogout={handleLogout}>
                <SRMDashboard />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        
        {/* SRM 模块 */}
        <Route 
          path="/srm" 
          element={
            <PrivateRoute>
              <MainLayout onLogout={handleLogout}>
                <SRMDashboard />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/srm/supplier-base-info" 
          element={
            <PrivateRoute>
              <MainLayout onLogout={handleLogout}>
                <SupplierBaseInfo />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/srm/data-preprocessing" 
          element={
            <PrivateRoute>
              <MainLayout onLogout={handleLogout}>
                <DataPreprocessing />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/srm/qualification" 
          element={
            <PrivateRoute>
              <MainLayout onLogout={handleLogout}>
                <QualificationManagement />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/srm/category-grading" 
          element={
            <PrivateRoute>
              <MainLayout onLogout={handleLogout}>
                <CategoryGrading />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/srm/purchase-orders" 
          element={
            <PrivateRoute>
              <MainLayout onLogout={handleLogout}>
                <PurchaseOrderManagement />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        
        {/* 默认重定向到 SRM 总览 */}
        <Route path="*" element={<Navigate to="/srm" />} />
      </Routes>
    </Router>
  );
}

export default App; 