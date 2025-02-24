import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/sidebar"

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className='flex h-[500px]  md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
			 <Sidebar/>
			<MessageContainer />
		</div>
    </div>
  )
}
export default Home;