namespace XT;

using { managed } from '@sap/cds/common';
using { Structures } from './aspects';


entity ReplicationTrace {
    key  timestamp        : Structures.EventDate;
    key  procedure        : Structures.ObjectName;
    
    /*Error details*/
        ErrorCode         : Structures.ErrorCode;
        ErrorText         : Structures.ErrorText;
};

entity Timer {
    key locked : Integer;
};