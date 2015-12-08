function dataBase(request,data){
  var db,
  allData,
  data1 = [];

  switch(request){
    case 'create':
      db = Ti.Database.open('ContactList');
      db.execute('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY,
      name TEXT,cel INTEGER,email TEXT,address TEXT,
      latitude REAL,longitude REAL,image BLOB);');
      db.close();
      Ti.API.info('created');
    break;
    case 'add':
      db = Ti.Database.open('ContactList');
      db.execute('INSERT INTO contacts(name,cel,email,address,imgUrl,
        latitude,longitude) VALUES(?,?,?,?,?,?,?);',data.name,data.cel,
        data.email,data.address,data.latitude,data.longitude,data.blobimg);
      db.close();
      alert("added");
      break;
    case 'querying':
      db = Ti.Database.open('ContactList');
      var req = data.toString(),
      query = 'SELECT ' + req + ' FROM contacts;';
      allData = db.execute(query);
      while(allData.isValidRow()){
        data1.push(allData.fieldByName(req));
        allData.next();
      }
      db.close();
      return data1;
      break;
    case 'query':
      db = Ti.Database.open('ContactList');
      allData = db.execute('SELECT * FROM contacts WHERE id = ?;',data);
      while(allData.isValidRow()){
        data1.push(allData.fieldByName('image'));
        data1.push(allData.fieldByName('name'));
        data1.push(allData.fieldByName('cel'));
        data1.push(allData.fieldByName('email'));
        data1.push(allData.fieldByName('address'));
        allData.next();
      }
      db.close();
      return data1;
      break;
    case 'queryMap':
      db = Ti.Database.open('ContactList');
      allData = db.execute('SELECT latitude,longitude FROM contacts WHERE id=?;'
      ,data);
      while(allData.isValidRow()){
        data1.push(allData.fieldByName('latitude'));
        data1.push(allData.fieldByName('longitude'));
        allData.next();
      }
      db.close();
      return data1;
      break;
      case 'delete':
      db = Ti.Database.open('ContactList');
      db.execute('DELETE FROM contacts WHERE id = ?;',data);
      db.close();
      break;
    }
}
module.exports = dataBase;
