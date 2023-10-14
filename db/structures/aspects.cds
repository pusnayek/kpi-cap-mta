context Structures {

    type ScenarioID     : String(10);
    
    /* Competency details */
    type CompetencyType {
        Id                   : String(100);
        Name                 : String(100);
        Area                 : String(100);
        Description          : String(500);
        CompetencyType       : String(50);
        GrantsCertificate    : String(5);
    };

    type CompetencyId        : String(50);

    /* Competency details */
    type CompetencyValues {
        Professional   : Decimal(3,0);
        Regulation     : Decimal(3,0);
        Total          : Decimal(3,0);
    };    
    
    /* Item details */
    type ItemType {
        ID            : String(50);
        Type          : String(50);
        Title         : String(255);
    };    

    type _ItemId       : String(50);
    type _ItemType     : String(50);
    type _ItemTitle    : String(500);

    /*Delta extraction attributes */
    type DeltaKeys {
        Action          : String(1);
        LastUpdateTime  : Timestamp;
        Record          : Integer64;
    };    

    type _DeltaKeys {
        Action          : String(1);
        LastUpdateTime  : Timestamp;
    };    

    type DeltaAction    : String(1);
    type DeltaRecord    : Integer64;
        
    type UserID          : String(50);
     /*Name of the employee*/
    type  EmployeeID      : String(50);
    type  FirstName       : String(100);
    type  LastName        : String(100);
    /*Other employee attributes*/
    type  Domain          : String(100);
    type  JobCode         : String(100);
    type  JobGroup        : String(100);
    /*Direct Manager details*/    
    type  ManagerUserID   : String(50);
    type  ManagerName     : String(200);

    type  Department      : String(100);
    type  Division        : String(100);
    type  JobLocation     : String(100);
    type  EventDate       : Timestamp; //String(30);

    type  RetainingNumer        : Integer;
    type  RetainingNumerString  : String(30);

    type CompletionStatus : String(50);
    
    type ProcessingStatus : String(1);

    type EmployeeStatus   : String(10);
    type EmpCustStatus    : String(100);
    
    type OperationBinary  : hana.TINYINT;

    type ActivationStatus : hana.TINYINT;

    type  AssignedBy      : String(100);
    type  GroupBU	      : String(100);
    type  EmployeeGroup   : String(100);
    
    /**Log domains **/
    type ObjectName       : String(200);
    type ErrorCode        : Integer;
    type ErrorText        : String(500);
    type DirectReportee   : hana.TINYINT;

    /* Table types */
    type DomainValues {
        Domain   : String(100);
    };    

    type ExtractionStatusType : String(50);
    type ExtractionStatus     : String(10);

    type AssignmentStatus : String(1);

};