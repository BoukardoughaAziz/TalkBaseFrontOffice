import { Button } from '@/components/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Briefcase, Building, Mail, Phone } from 'lucide-react'
import { useState } from 'react'


export default function ClientInformationUI() {
 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <div className='w-full max-w-xs p-4 bg-white shadow-md rounded-xl'>
    <Accordion type='single' collapsible defaultValue='general-info'>
      {/* General Info Section */}
      <AccordionItem value='general-info'>
        <AccordionTrigger className='font-semibold'>
          General Info
        </AccordionTrigger>
        <AccordionContent>
          <div className='space-y-3'>
            <div className='relative flex items-center'>
              <Briefcase
                className='absolute left-2 text-gray-400'
                size={18}
              />
              <Input
                name='name'
                placeholder='Name'
                className='pl-8'
                onChange={handleChange}
              />
            </div>
            <div className='relative flex items-center'>
              <Mail className='absolute left-2 text-gray-400' size={18} />
              <Input
                name='email'
                placeholder='Email'
                className='pl-8'
                onChange={handleChange}
              />
            </div>
            <div className='relative flex items-center'>
              <Phone className='absolute left-2 text-gray-400' size={18} />
              <Input
                name='phone'
                placeholder='Phone'
                className='pl-8'
                onChange={handleChange}
              />
            </div>
            <div className='relative flex items-center'>
              <Building className='absolute left-2 text-gray-400' size={18} />
              <Input
                name='company'
                placeholder='Company'
                className='pl-8'
                onChange={handleChange}
              />
            </div>
            <div className='relative flex items-center'>
              <Briefcase
                className='absolute left-2 text-gray-400'
                size={18}
              />
              <Input
                name='jobTitle'
                placeholder='Job Title'
                className='pl-8'
                onChange={handleChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Notes Section */}
      <AccordionItem value='notes'>
        <AccordionTrigger className='font-semibold'>Notes</AccordionTrigger>
        <AccordionContent>
          <textarea
            className='w-full h-24 p-2 border rounded-md'
            placeholder='Add your notes here...'
          ></textarea>
        </AccordionContent>
      </AccordionItem>
      <Button size='lg' variant='default'>
        Save
      </Button>
    </Accordion>
  </div>
  )
}
