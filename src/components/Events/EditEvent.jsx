import { Link, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import {updateEvent} from '../../util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();

  const params= useParams();

 const{data,isPending,isError,error}= useQuery({
    queryKey:['events',params.id],
    queryFn:({signal})=>fetchEvent({signal,id:params.id})
  })

const {mutate}= useMutation({
  mutationFn:updateEvent,
  // onSuccess:()=>{
    
  // }
 })

  function handleSubmit(formData) {

    mutate({id:params.id,event:formData})
    navigate('../')
  }

  function handleClose() {
    navigate('../');
  }
  let content ;
  if(isPending){
    content=<div><LoadingIndicator/></div>
  }

  if(isError){
    <ErrorBlock message={error.info?.message||"failed to load "}/>
  }
  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    </Modal>
  );
}
