namespace TT;

using { managed } from '@sap/cds/common';
using { Structures } from './aspects';

entity Employee {
    key  UserID            : Structures.UserID;
        /*Delta keys*/
    key  Delta             : Structures.DeltaKeys;
    
    /*Name of the employee*/
        EmployeeID        : Structures.EmployeeID;
        EmployeeStatus    : Structures.EmployeeStatus;
        FirstName         : Structures.FirstName;
        LastName          : Structures.LastName;

        
    /*Other employee attributes*/
        Domain            : Structures.Domain;
        JobCode           : Structures.JobCode;
        JobGroup          : Structures.JobGroup;

    /*Direct Manager details*/    
        ManagerUserID     : Structures.ManagerUserID;
        ManagerName       : Structures.ManagerName;

        Department        : Structures.Department;
        Division          : Structures.Division;
        JobLocation       : Structures.JobLocation;

        GroupBU           : Structures.GroupBU;
        EmployeeGroup     : Structures.EmployeeGroup;
        EmpCustomStatus   : Structures.EmpCustStatus;

};

entity Employees {
    key  UserID            : Structures.UserID;
        /*Delta keys*/
    key  Delta             : Structures.DeltaKeys;
    
    /*Name of the employee*/
        EmployeeID        : Structures.EmployeeID;
        EmployeeStatus    : Structures.EmployeeStatus;
        FirstName         : Structures.FirstName;
        LastName          : Structures.LastName;

        
    /*Other employee attributes*/
        Domain            : Structures.Domain;
        JobCode           : Structures.JobCode;
        JobGroup          : Structures.JobGroup;

    /*Direct Manager details*/    
        ManagerUserID     : Structures.ManagerUserID;
        ManagerName       : Structures.ManagerName;

        Department        : Structures.Department;
        Division          : Structures.Division;
        JobLocation       : Structures.JobLocation;

        GroupBU           : Structures.GroupBU;
        EmployeeGroup     : Structures.EmployeeGroup;
        EmpCustomStatus   : Structures.EmpCustStatus;

};


entity Item {
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;

        /*Delta keys*/
    key    Delta           : Structures.DeltaKeys;

        /*Item details*/
        ItemTitle         : Structures._ItemTitle;

    /*Other employee attributes*/
        Competency        : Structures.CompetencyType;
    /*Number of days certification is valid*/ 
        RetainingNumer    : Structures.RetainingNumer;
}; 

entity Items {
    key  ItemID            : Structures._ItemId;

        /*Delta keys*/
    key    Delta           : Structures.DeltaKeys;

        /*Item details*/
    key  ItemType          : Structures._ItemType;
        
        ItemTitle         : Structures._ItemTitle;

    /*Other employee attributes*/
        Competency        : Structures.CompetencyType;
    /*Number of days certification is valid*/ 
        RetainingNumer    : Structures.RetainingNumer;
}; 


entity Assignment {
    key  UserID            : Structures.UserID;
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;
    
        /*Delta keys*/
    key   Delta             : Structures._DeltaKeys;

        AssignmentDate     : Structures.EventDate;
        AssignedBy		   : Structures.AssignedBy;
};  

entity Assignments {
    key  UserID            : Structures.UserID;
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;
    
        /*Delta keys*/
    key   Delta             : Structures._DeltaKeys;

        AssignmentDate     : Structures.EventDate;
        AssignedBy		   : Structures.AssignedBy;
};  

entity RecentAssignment {
    key  UserID            : Structures.UserID;
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;

        AssignedBy		   : Structures.AssignedBy;
};  


entity Completion {
    key  UserID            : Structures.UserID;

    /*Delta keys*/
    key    Delta           : Structures.DeltaKeys;

        /*Item details*/
    key ItemID             : Structures._ItemId;
    key ItemType           : Structures._ItemType;

        CompletionStatus   : Structures.CompletionStatus;
        CompletionDate     : Structures.EventDate;
};  

entity Completions {
    key  UserID            : Structures.UserID;

    /*Delta keys*/
    key    Delta           : Structures.DeltaKeys;

        /*Item details*/
    key ItemID             : Structures._ItemId;
    key ItemType           : Structures._ItemType;

        CompletionStatus   : Structures.CompletionStatus;
        CompletionDate     : Structures.EventDate;
};  

entity RecentCompletion {
    key  UserID            : Structures.UserID;
    key  ItemID            : Structures._ItemId;
    key  ItemType          : Structures._ItemType;
};  


entity AdminAccess {
    key UserID             : Structures.UserID;
    key Domain             : Structures.Domain;
};