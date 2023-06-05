namespace CT;

using { managed } from '@sap/cds/common';
using { Structures } from './aspects';

entity OpsMerge {
    key Insert            : Structures.OperationBinary;
    key Update            : Structures.OperationBinary;
    key Delete            : Structures.OperationBinary;
    
    /*Final operation decision*/
        Operation         : Structures.DeltaAction;
};

entity MapCompletionStatus {
    key CompletionStatus  : Structures.CompletionStatus;
    key MappedStatus      : Structures.CompletionStatus;
};    


entity ExtractionStatus {
    key ExtractionType      : Structures.ExtractionStatusType;

        ReplicationStart    : Structures.EventDate;
        ReplicationEnd      : Structures.EventDate;
        DeltaPullTime       : Structures.EventDate;
        
        Active              : Structures.ActivationStatus;

        Records			    : Structures.DeltaRecord;	
};


entity ExtractionStatusHistory {
    key ExtractionType      : Structures.ExtractionStatusType;
    key DeltaPullStart      : Structures.EventDate;
    key DeltaPullEnd        : Structures.EventDate;

        ReplicationStart    : Structures.EventDate;
        ReplicationEnd      : Structures.EventDate;
        DeltaPullTime       : Structures.EventDate;
        Replicated          : Structures.ActivationStatus;

        Records			    : Structures.DeltaRecord;	
};