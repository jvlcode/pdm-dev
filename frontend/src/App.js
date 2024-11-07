import './App.css';
import Sidebar from './components/Sidebar';
import './index.css';
import { Routes, Route, Outlet, Link, BrowserRouter, HashRouter} from "react-router-dom";
import Main from './components/Main';
import Logo from './image.png'
import GlobalLibrary from './pages/GlobalLibrary';

const routeMappings = [
  { path: 'gl/cg/:cg/cc/:cc',  component: GlobalLibrary },
];

function App() {
  
  return (
    	<>
			<header class="bg-indigo-900 text-white p-4">
				<div class="container mx-auto flex  items-center">
					<img src={Logo} alt="Logo" class="h-8" />
					<div class="flex justify-center w-full uppercase">
						<h1 class="text-md font-bold text-yellow-500">Project Digital Execution Hub</h1>
					</div>
					<div class="w-60 flex items-center">
						<p>User Information</p>
						<img src="./icons/check.png" class="h-5" alt="" />
					</div>
				</div>
			</header>
			<BrowserRouter>
				<div className='flex'>
					<Sidebar/>
					<Main>
						<Routes>
							{routeMappings.map(({ path,  component: Component }) => (
								<Route 
									key={path}
									path={path}
									element={<Component/>} 
								/>
							))}
						</Routes>
					</Main>
				</div>
			</BrowserRouter>
    	</>
  );
}

export default App;
