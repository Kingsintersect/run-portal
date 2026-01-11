'use client';
import React from 'react';
import { exportToExcel } from '@/lib/exportUtils';
import DropDownMenu from './DropDownMenu';
import { ObjectType } from '@/types/generic.types';
import { GenericDataType } from '@/types/generic.types';

interface ExportDropdownProps {
   data: ObjectType[];
   columns?: string[]; // Accepts custom column fields
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ data, columns }) => {
   const handleExport = (type: 'all' | 'complete_application' | 'acceptance' | 'tuition') => {
      switch (type) {
         case 'all':
            exportToExcel(
               data,
               'all_students',
               columns,
            );
            break;
         case 'complete_application':
            exportToExcel(
               data.filter((student: GenericDataType) => student.is_applied === 0),
               'students_not_completed_application_form',
               columns,
            );
            break;
         case 'acceptance':
            exportToExcel(
               data.filter((student: GenericDataType) => student.acceptance_fee_payment_status === 0),
               'students_not_paid_acceptance_fee',
               columns,
            );
            break;
         case 'tuition':
            exportToExcel(
               data.filter((student: GenericDataType) => student.tuition_payment_status === 0),
               'students_not_paid_tuition_fee',
               columns,
            );
            break;
         default:
            break;
      }
   };

   // return (
   //    <Dropdown label="Export Data" inline>
   //       <Dropdown.Item
   //          onClick={() => handleExport('all')}
   //       >
   //          Export All Students
   //       </Dropdown.Item>
   //       <Dropdown.Item
   //          onClick={() => handleExport('complete_application')}
   //       >
   //          Export Students Not Completed Application Form
   //       </Dropdown.Item>
   //       <Dropdown.Item
   //          onClick={() => handleExport('acceptance')}
   //       >
   //          Export Students Not Paid Acceptance Fee
   //       </Dropdown.Item>
   //       <Dropdown.Item
   //          onClick={() => handleExport('tuition')}
   //       >
   //          Export Students Not Paid Tuition Fee
   //       </Dropdown.Item>
   //    </Dropdown>
   // );

   const menuItems = [
      { title: 'Export All Users', condition: 'ACTIVE' as const, checked: false, onClick: () => handleExport('all') },
      { title: 'Export Applied Admission', condition: 'ACTIVE' as const, checked: false, onClick: () => handleExport('complete_application') },
      { title: 'Export Acceptance Paid', condition: 'ACTIVE' as const, checked: false, onClick: () => handleExport('acceptance') },
      { title: 'Export Tuition Paid', condition: 'ACTIVE' as const, checked: false, onClick: () => handleExport('tuition') },
   ]

   return (
      <>
         <DropDownMenu
            menu={menuItems}
            variant="RADIO"
            title={"DropDown Label"}
            menuLabel={''}
         />
      </>
   );
};

export default ExportDropdown;
