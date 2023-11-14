import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "./utils/Loader";
import Tooltip from "./utils/Tooltip";

const Appointments = () => {
	const authState = useSelector((state) => state.authReducer);
	const [appointments, setAppointments] = useState([]);
	const [fetchData, { loading }] = useFetch();

	const fetchAppointments = useCallback(() => {
		const config = {
			url: "/appointments",
			method: "get",
			headers: { Authorization: authState.token },
		};
		fetchData(config, { showSuccessToast: false }).then((data) =>
			setAppointments(data.appointments)
		);
	}, [authState.token, fetchData]);

	useEffect(() => {
		if (!authState.isLoggedIn) return;
		fetchAppointments();
	}, [authState.isLoggedIn, fetchAppointments]);

	const handleDelete = (id) => {
		const config = {
			url: `/appointments/${id}`,
			method: "delete",
			headers: { Authorization: authState.token },
		};
		fetchData(config).then(() => fetchAppointments());
	};

	return (
		<>
			<div className="my-2 mx-auto max-w-[700px] py-4">
				{appointments.length !== 0 && (
					<h2 className="my-2 ml-2 md:ml-0 text-xl">
						Your Appointments ({appointments.length})
					</h2>
				)}
				{loading ? (
					<Loader />
				) : (
					<div>
						{appointments.length === 0 ? (
							<div className="w-[600px] h-[300px] flex items-center justify-center gap-4">
								<span>No appointments found</span>
								<Link
									to="/appointments/add"
									className="bg-primary text-white hover:bg-green-700 font-medium rounded-md px-4 py-2"
								>
									+ Book Appointment
								</Link>
							</div>
						) : (
							appointments.map((appointment, index) => (
								<div
									key={appointment._id}
									className="bg-white my-4 p-4 text-gray-600 rounded-md shadow-md"
								>
									<div className="flex">
										<span className="font-medium">
											Appointment #{index + 1}
										</span>

										<Tooltip text={"Edit this appointment"} position={"top"}>
											<Link
												to={`/appointments/${appointment._id}`}
												className="ml-auto mr-2 text-green-600 cursor-pointer"
											>
												<i className="fa-solid fa-pen"></i>
											</Link>
										</Tooltip>

										<Tooltip text={"Cancel this appointment"} position={"top"}>
											<span
												className="text-red-500 cursor-pointer"
												onClick={() => handleDelete(appointment._id)}
											>
												<i className="fa-solid fa-trash"></i>
											</span>
										</Tooltip>
									</div>

									<div>
										<p>Name: {appointment.name}</p>
										<p>Surname: {appointment.surname}</p>
										<p>Date: {appointment.date}</p>
										<p>Time: {appointment.time}</p>
										<p>Email: {appointment.email}</p>
									</div>
								</div>
							))
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Appointments;
