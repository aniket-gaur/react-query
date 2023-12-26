import { Link, Outlet,useNavigate,useParams } from 'react-router-dom';
import {fetchEvent,deleteEvent,queryClient} from '../../util/http.js';
 
import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Modal from '../UI/Modal.jsx';
import { useState } from 'react';

export default function EventDetails() {
  const[isdeleting,setisdeleting]=useState(false);


  const param =useParams();
  const navigate=useNavigate();
  const {data,isPending,isError,error}=useQuery({
    queryKey:['events',param.id],
    queryFn:({signal})=>fetchEvent({signal,id:param.id})
  });


  // using usequery and mutate together we can use alias with isPending key value pair 
const{mutate,isPending:isPendingDeletion,isError:isErrorDeletion,error:errordDeletion}=useMutation({
  mutationFn:deleteEvent,
  onSuccess:()=>{
queryClient.invalidateQueries({queryKey:['events'],exact:true,
refetchType:'none'
})

    navigate('/events');
  }
});


function startdeleting(){
  setisdeleting(true);
}
function stopisdeleting(){
  setisdeleting(false);
}
function handledelete(){
mutate({id:param.id})

}

 


  let content;
if(isPending){
  content=<LoadingIndicator/>
}
if(isError){
  content=<ErrorBlock message={error.info?.message|| "failed to load "}/>
}
if(data){
  
  const formattedDate=new Date(data.date).toLocaleDateString({
    day:'numeric',
    month:'short',
    year:'numeric'

  });
  
  content=(

  
  <>
  
  
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={startdeleting} >Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        
      
  
  
      <div id="event-details-content">
  <img src={`http://localhost:3000/events/${data.image}`} alt="event-image " />
  <div id="event-details-info">
    <div>
      <p id="event-details-location">{data.location}</p>
      <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @{data.time}</time>
    </div>
    <p id="event-details-description">{data.description}</p>
  </div>
</div>
  </>
  
  
  )
}

  return (
    <>
    {isdeleting && (<Modal onClose={stopisdeleting}>


      <h1>Are u sure you want to delete 
        ?
      </h1>
      <div className="form-actions">
        {isPendingDeletion&& <p> Deletion is on the way ...</p>}

        {!isPendingDeletion && (<>
        
          <button onClick={stopisdeleting} value={isdeleting}>  
  Cancel
</button>
<button onClick={handledelete}>
  Delete
</button>
        
        </>)}


      </div>
   
   {isErrorDeletion && <ErrorBlock message={errordDeletion.info?.message||"failed to load "}/>}
   
    </Modal>)}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
       </>
  );
}
