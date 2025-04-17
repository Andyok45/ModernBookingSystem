import { api } from '@/utils/api';
import React from 'react';

interface dashboardProps {}

const dashboard: React.FC<dashboardProps> = ({}) => {

  const { mutate } = api.admin.sensitive.useMutation()

  return <div>dashboard
    <br />
    <button type='button' onClick={() => mutate()}>
      TOP SECRET ACTION
    </button></div>
}

export default dashboard;