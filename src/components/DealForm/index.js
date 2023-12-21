import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './deal-form.css';

const DealForm = () => {
  const [formData, setFormData] = useState({
    title: 'Deal #',
    value: 0,
    currency: 'USD',
    org_id: 1,
    stage_id: 1,
    status: 'open',
    expected_close_date: '',
    probability: 30,
    visible_to: 1,
    add_time: '',
  })

  const [technicians, setTechnicians] = useState([])
  const [createdDealId, setCreatedDealId] = useState(null)

  useEffect(() => {
    axios.get('https://api.pipedrive.com/v1/users?api_token=f4341ed8fdb38e79da06afd836033475cbc5a0a8')
      .then(response => {
        const techniciansList = response.data.data.map(user => ({
          id: user.id,
          name: user.name,
        }))
        setTechnicians(techniciansList)
      })
      .catch(error => console.error('Error fetching technicians:', error))
  }, [])

  const handleTechnicianChange = (e) => {
    setFormData({ ...formData, technician: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log('Sending request...')

      const response = await axios.post('https://api.pipedrive.com/v1/deals?api_token=f4341ed8fdb38e79da06afd836033475cbc5a0a8', formData)

      console.log('Deal was added successfully!', response.data)
      setCreatedDealId(response.data.data.id)

      alert('Deal created! Check it out in Pipedrive.')
    } catch (err) {
      const errorToLog = err.response?.data || err.message

      console.log('Adding failed', errorToLog)
    }
  }

  return (
    <>
    <h1 style={{ textAlign: 'center' }}>Create a Job</h1>
    <form className='deal-form' onSubmit={handleSubmit}>
      <div className='deal-form-field'>
        <label>Title</label>
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      </div>
      <div className='deal-form-field'>
        <label>Value</label>
        <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
      </div>
      <div className='deal-form-field'>
        <label>Currency</label>
        <input type="text" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} />
      </div>

      <div className='deal-form-field'>
        <label>Expected Close Date</label>
        <input type="date" value={formData.expected_close_date} onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })} />
      </div>
      <div className='deal-form-field'>
        <label>Probability</label>
        <input type="number" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: e.target.value })} />
      </div>

      <div className='deal-form-field'>
        <label>Select Technician</label>
        <select value={formData.technician} onChange={handleTechnicianChange}>
          {technicians.map(tech => (
            <option key={tech.id} value={tech.id}>{tech.name}</option>
          ))}
        </select>
      </div>
      

      <button type="submit">Create Deal</button>

      {createdDealId && (
        <div>
          <p>Deal created! Check it out:</p>
          <a href={`https://youraccountname.pipedrive.com/deal/${createdDealId}`} target="_blank" rel="noopener noreferrer">
            View Deal
          </a>
        </div>
      )}
    </form>
    </>
  )
}

export default DealForm;