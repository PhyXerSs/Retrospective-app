import { FC } from 'react';
import Navbar from './Navbar'

const Layout: FC<any> = ({ children })=> {
  return (
    <>
      <Navbar />
      <div className="bg-gray-light p-10 pt-[70px]">
        <div className="bg-white rounded-md p-5" style={{ minHeight: 'calc(100vh - 130px)' }}>
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}

export default Layout;