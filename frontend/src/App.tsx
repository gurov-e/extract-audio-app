import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home-page/HomePage.tsx';

const App = () => {
	return (
		<Routes>
			<Route index element={<HomePage />} />
		</Routes>
	);
};

export default App;
