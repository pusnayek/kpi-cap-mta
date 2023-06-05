namespace FT;

using { managed } from '@sap/cds/common';
using { Structures } from './aspects';

entity Employee {
    key UserID            : Structures.UserID;

    /*Name of the employee*/
        EmployeeID        : Structures.EmployeeID;
        FirstName         : Structures.FirstName;
        LastName          : Structures.LastName;

        EmployeeStatus    : Structures.EmployeeStatus;
    
    /*Other employee attributes*/
        Domain            : Structures.Domain;
        JobCode           : Structures.JobCode;
        JobGroup          : Structures.JobGroup;

        GroupBU           : Structures.GroupBU;
        EmployeeGroup     : Structures.EmployeeGroup;
        EmpCustomStatus   : Structures.EmpCustStatus;

        Department        : Structures.Department;
        Division          : Structures.Division;
        JobLocation       : Structures.JobLocation;
    
    /*Direct Manager details*/    
        ManagerUserID     : Structures.ManagerUserID;
        ManagerName       : Structures.ManagerName;
};

entity Item {
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;

    /*Item details*/
        ItemTitle         : Structures._ItemTitle;

    /*Competency attributes*/
        Competency        : Structures.CompetencyType;

    /*Number of days certification is valid*/    
        RetainingNumer    : Structures.RetainingNumer;
}; 

entity Assignment {
    key  UserID            : Structures.UserID;
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;

        /*Item details*/
        AssignmentDate     : Structures.EventDate;
        AssignedBy		   : Structures.AssignedBy;
};  

entity Completion {
    key  UserID            : Structures.UserID;
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;

        /*Item details*/
        CompletionStatus   : Structures.CompletionStatus;
        CompletionDate     : Structures.EventDate;
};  

entity AdminAccess {
    key  UserID            : Structures.UserID;
    key  Domain            : Structures.Domain;
    key  SubDomain         : Structures.Domain;
};

entity ManagerReportees {
    key ManagerUserID     : Structures.ManagerUserID;
    key UserID            : Structures.UserID;
    key Direct            : Structures.DirectReportee;
};  

entity TrainingAdminAccess {
    key  UserID            : Structures.UserID;
    key  Domain            : Structures.Domain;
};  

entity Competencies {
    key  UserID            : Structures.UserID;
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;

    /*Item details*/
        ItemTitle         : Structures._ItemTitle;

    /*Competency attributes*/
        Competency        : Structures.CompetencyType;

    /*Number of days certification is valid*/    
        RetainingNumer    : Structures.RetainingNumer;

        CompletionStatus   : Structures.CompletionStatus;
        CompletionDate     : Structures.EventDate;

        AssignmentDate     : Structures.EventDate;

    /*Latest Assigned Item details*/
        LastAssignedItemID       : Structures._ItemId;
        LastAssignedItemType     : Structures._ItemType;
        LastAssignedItemTitle    : Structures._ItemTitle;
        LatestItemAssignmentDate : Structures.EventDate;
        LastItemAssignedBy		 : Structures.AssignedBy;
        HasCurrentAssignment	 : Structures.AssignmentStatus;
        HasExpiry				 : Structures.AssignmentStatus;
        ExpirationDate			 : Structures.EventDate;
        
}; 