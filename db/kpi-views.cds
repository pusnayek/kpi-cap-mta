@cds.persistence.exists 
@cds.persistence.calcview 
Entity POPULATIONS {
key     USERID: String(50)  @title: 'USERID: USERID' ; 
        ACTOR: String(2)  @title: 'ACTOR: ACTOR' ; 
        INDEX_OF_POPULATION: UInt8  @title: 'INDEX_OF_POPULATION: INDEX_OF_POPULATION' ; 
}