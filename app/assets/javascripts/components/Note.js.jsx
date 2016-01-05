var Note = React.createClass({
  getInitialState: function() {
    return { notes: this.props.notes};
  },

  getDefaultState: function() {
    return { notes: [] };
  },

  showAddForm: function() {
    this.setState({showAdd: !this.state.showAdd})
  },

  submitNote: function(e){
    e.preventDefault();
    var self = this;
    $.ajax({
      url: '/notes',
      type: 'POST',
      data: {note: {name: this.state.noteName, description: this.state.noteDescription}},
      success: function(data){
        var notes = self.state.notes;
        notes.push({name: data.name, description: data.description});
        self.setState({notes: notes, showNoteDescription: false, showAdd: false, noteName: null, noteDescription: null});
      }
    });
  },

  addNoteName: function(e){
    this.setState({noteName: e.currentTarget.value});
  },

  addNoteDescription: function(e){
    this.setState({noteDescription: e.currentTarget.value});
  },


  addNoteForm: function() {
    if (this.state.showAdd){
      return(<div>
              <form onSubmit={this.submitNote}>
                <div className='input-field'>
                  <input autoFocus="true" type='text' placeholder='Note Name' onChange={this.addNoteName} />
                  <textarea placeholder='Note Description' onChange={this.addNoteDescription} />
                  <br />
                  <br />
                  <button className='btn waves-effect' type='submit'>
                  Save
                  </button>
                </div>
              </form>
              </div>);
    }
  },

  deleteNote: function(noteId){
    debugger
    var self = this;
    $.ajax({
      url: "/notes/" + noteId,
      type: 'DELETE',
      success: function(data){
        var notes=[]
        for(var i = 0; i < self.state.notes.length; i++){
          if(self.state.notes[i].id != data.id){
            notes.push(self.state.notes[i])
          }
        }
        self.setState({notes: notes})
        alert(data.name + " successfully deleted");
      }
    });
  },

  showNoteDescription: function() {
    this.setState({showNoteDescription: !this.state.showNoteDescription})
  },

  displayDescription: function(i){
    if (this.state.showNoteDescription){
      return(<div>
        {this.state.notes[i].description}
        </div>)
    }
  },


  displayNotes: function() {
    var notes =[];
    for(var i = 0; i < this.state.notes.length; i++){
      notes.push(
        <div className='card yellow accent-1 col s3' onMouseOver={this.showNoteDescription}>
          <div className='card-content'>
            <span className='card-title'>{this.state.notes[i].name}</span>
            {this.displayDescription(i)}
            <a className='btn waves-effect' onClick={this.deleteNote.bind(this, this.state.notes[i].id)}>Delete</a>
          </div>
        </div>);
    };
    return notes;
  },

  render: function(){
    return(<div>
            <a className='waves-effect waves-light btn' onClick={this.showAddForm}>
            Add Note
            </a>
            {this.addNoteForm()}
            <div className='row'>
            {this.displayNotes()}
            </div>
            </div>);
  }
});