import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { Line } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import Analytics from '../../services/Analytics'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

export default function Analyticss() {
	var d = new Date()
	d.setDate(d.getDate() - 15)
	var f = new Date()
	f.setDate(d.getDate() + 20)
	const [fromDate, setFromDate] = useState(d.toJSON()?.split('T')[0])
	const [toDate, setToDate] = useState(f.toJSON()?.split('T')[0])
	const [type, setType] = useState('call')
	const [list, setList] = useState([])
	const [datasets, setDatasets] = useState([])

	const options = {
		responsive: true,
		// maintainAspectRatio: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Analytics Line Chart',
			},
		},
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	}

	const handleSearch = async () => {
		try {
			// console.log(fromDate, toDate)
			const data = await Analytics.query(fromDate, toDate, type)
			setList([])
			setList(data.data[0])
			console.log('LIST ---', data.data[0])
			// console.log('DATASET ---', Object.keys(list).map((item,i) => Object.values(list)[i].length))
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		handleSearch()
	}, [])
	useEffect(() => {
		handleSearch()
	}, [type])
	useEffect(() => {
		handleSearch()
	}, [fromDate, toDate])

	var getDaysArray = function (start, end) {
		for (
			var arr = [], dt = new Date(start);
			dt <= end;
			dt.setDate(dt.getDate() + 1)
		) {
			arr.push(new Date(dt))
		}
		return arr
	}

	var daylist = getDaysArray(new Date(fromDate), new Date(toDate))
	const labels = daylist.map((v) => v.toISOString().slice(0, 10))

	const fixedSet = {
		labels: list ? labels.map((val) => new Date(val).toDateString()) : [],
		datasets: [
			{
				label: type,
				data: labels.map((lab, index) => {
					if (list[`${new Date(lab).toDateString()}`]) {
						// console.log('YES --', new Date(lab).toDateString(), list)
						return list[`${new Date(lab).toDateString()}`].length
					} else {
						return 0
					}
					// console.log(lab)
					// return index
				}),
				// data: Object.keys(list).map((item, i) => Object.values(list)[i].length),
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
				// borderWidth: 3,
			},
		],
	}
	console.log('ALL DATA ---', fixedSet)

	return (
		<Layout pageName="analytics">
			<div className="p-5 pb-5">
				<div className="container">
					<div className="card p-2">
						<div className="row align-items-center">
							<div className="col-md-5 col-sm-12">
								<input
									type="date"
									className="form-control mb-2 mt-2"
									onChange={(e) => setFromDate(e.target.value)}
								/>
							</div>
							<div className="col-md-5 col-sm-12">
								<input
									type="date"
									className="form-control mb-2 mt-2"
									onChange={(e) => setToDate(e.target.value)}
								/>
							</div>
							<div className="col-md-2 col-sm-12">
								<button
									className="btn btn-success w-100"
									onClick={handleSearch}
								>
									Search
								</button>
							</div>
						</div>
					</div>
					<div className="mb-4">
						{[
							'request-view',
							'profile-view',
							'personal-info-view',
							'call',
							'declined-call',
							'message',
							'search',
							'match-accept',
							'match-rejected',
						].map((val, i) => {
							return (
								<button
									key={`btn-${i}`}
									className={`btn btn-sm m-2 ${
										type === val ? 'btn-success' : 'border border-success'
									}`}
									onClick={() => setType(val)}
								>
									{val}
								</button>
							)
						})}
					</div>
				</div>
				<div className="container-fluid">
					<div className="card" style={{ height: '70vh' }}>
						<div className="card-body">
							<div className="d-flex">
								<h6>
									From{' '}
									<b>
										<h4>{new Date(fromDate).toDateString()}</h4>
									</b>
								</h6>
								<span className="ml-2">
									<h6>
										To{' '}
										<b>
											<h4>{new Date(toDate).toDateString()}</h4>
										</b>
									</h6>
								</span>
							</div>
							<Line options={options} data={fixedSet} height={'100%'} />
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
