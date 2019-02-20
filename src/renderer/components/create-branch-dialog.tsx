import * as React from 'react';
import { RepoState } from '../helpers/repo-state';
import { makeModal } from './make-modal';
import * as Git from 'nodegit';

export class CreateBranchFormProps {
  repo: RepoState;
  commit: Git.Commit;
  onClose: () => void;
}

export class CreateBranchFormState {
  branchName: string;
  checkout: boolean;
}

class CreateBranchForm extends React.PureComponent<CreateBranchFormProps, CreateBranchFormState> {
  constructor(props: CreateBranchFormProps) {
    super(props);
    this.state = {
      branchName: '',
      checkout: true
    }
    this.handleBranchNameChange = this.handleBranchNameChange.bind(this);
    this.handleCheckoutChange = this.handleCheckoutChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBranchNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({branchName: event.target.value});
  }

  handleCheckoutChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({checkout: event.target.checked});
  }

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.state.branchName) {
      await this.props.repo.createBranch(this.state.branchName, this.props.commit);
      if (this.state.checkout) {
        // It is a bit hacky to use the name while we can get a reference object
        this.props.repo.checkoutReference(`refs/heads/${this.state.branchName}`);
      }
      this.props.onClose(); 
    }
  }

  render() {
    return (
      <form className='modal-form' onSubmit={this.handleSubmit}>
        <div className='field-container'>
          <label htmlFor='name'>Name:</label>
          <input type='text' 
            id='name' 
            name='repo-name' 
            value={this.state.branchName} 
            onChange={this.handleBranchNameChange} />
        </div>
        <div className='field-container'>
          <label htmlFor='checkout'>Checkout after create:</label>
          <input type='checkbox' 
            id='checkout' 
            name='checkout' 
            checked={this.state.checkout} 
            onChange={this.handleCheckoutChange} />
        </div>
        <div className='button-container'>
          <button className='green-button' 
            type='submit' 
            disabled={!this.state.branchName}>
            Create branch
          </button>
        </div>
      </form>
    );
  }
}

export const CreateBranchDialog = makeModal(CreateBranchForm);