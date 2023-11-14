import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

const Appointment = () => {

  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData] = useFetch();
  const { appointmentId } = useParams();

  const mode = appointmentId === undefined ? "add" : "update";
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    date: "",
    time: "",
    email: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Book Appointment" : "Update Appointment";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = { url: `/appointments/${appointmentId}`, method: "get", headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setFormData({ ...data.appointment });
      });
    }
  }, [mode, authState, appointmentId, fetchData]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }



  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("appointment", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    if (mode === "add") {
      const config = { url: "/appointments", method: "post", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
    else {
      const config = { url: `/appointments/${appointmentId}`, method: "put", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
  }

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <MainLayout>
      <div className='container mx-auto px-4'>
        <form className='max-w-xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md' onSubmit={handleSubmit}>
          <h2 className='text-center text-2xl font-bold mb-6'>{mode === 'add' ? 'Book New Appointment' : 'Edit Appointment'}</h2>
          

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            {fieldError('name')}
          </div>

          <div className="mb-4">
            <label htmlFor="surname" className="block text-gray-700 text-sm font-bold mb-2">Surname</label>
            <input type="text" name="surname" id="surname" value={formData.surname} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            {fieldError('surname')}
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date</label>
            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            {fieldError('date')}
          </div>


          <div className="mb-4">
            <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">Time</label>
            <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            {fieldError('time')}
          </div>


          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            {fieldError('email')}
          </div>


          <div className="flex items-center justify-between mt-6">
            <button className='bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type="submit">
              {mode === 'add' ? 'Book Appointment' : 'Update Appointment'}
            </button>
            <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Appointment;
