import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {

  const router = useRouter();

  // console.log('Navbar', router)

  const { asPath } = router;

  const routes = [
    { name: 'Home', path: '/', shallow: true },
    { name: 'Facebook', path: '/facebook', shallow: true },
    { name: 'Poker' , path:'/poker', shallow:true},
    // { name: 'Logout', path: '/logout' },
  ];

    return (
      <nav className="fixed bg-white shadow-nav h-[50px] w-screen z-10">
        <ul className="flex flex-row">
          <li className="p-3 ml-1">
            <img className="block h-6 w-auto" src="/static/images/Icon/logoconnectx.png" alt="Logoconx"/>
          </li>
          {routes?.map((r: any)=> (
            <li
            key={r?.name}
            className={`p-3 ml-5 text-gray-tab hover:bg-secondary-gray-4 ${(asPath === r?.path) ? 'border-b-4 border-blue' : ''}`}>
              <Link href={r?.path} shallow={r.shallow}>{r?.name}</Link>
            </li>
          ))}
          <li className="p-2 ml-auto mr-1">
            <button
              onClick={(): void=> { router.push('/logout', undefined, { shallow: true })}}
              className="py-1 px-2 border-2 rounded-lg hover:bg-secondary-gray-4 border-primary-blue-1 text-primary-blue-1">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    )
  }

  export default Navbar;