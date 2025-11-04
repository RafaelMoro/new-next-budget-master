import { PersonalInformation } from '@/features/Login/Register/PersonalInformation'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('PersonalInformation', () => {
  it('should render the form fields and button', () => {
    const nextStep = jest.fn()
    const updatePersonalInformation = jest.fn()
    const personalInformation = {
      firstName: '',
      middleName: '',
      lastName: ''
    }

    render(
      <PersonalInformation
        direction={1}
        nextCb={nextStep}
        personalInformation={personalInformation}
        updatePersonalInformation={updatePersonalInformation}
      />
    )

    expect(screen.getByTestId('firstName')).toBeInTheDocument()
    expect(screen.getByTestId('middleName')).toBeInTheDocument()
    expect(screen.getByLabelText('Apellido')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Siguiente/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Volver/i })).toBeInTheDocument()
  })

  it('Given a user filling all the personal information, should go to the next step', async () => {
    const user = userEvent.setup()
    const nextStep = jest.fn()
    const updatePersonalInformation = jest.fn()
    const personalInformation = {
      firstName: '',
      middleName: '',
      lastName: ''
    }

    render(
      <PersonalInformation
        direction={1}
        nextCb={nextStep}
        personalInformation={personalInformation}
        updatePersonalInformation={updatePersonalInformation}
      />
    )

    const firstNameInput = screen.getByTestId('firstName')
    const middleNameInput = screen.getByTestId('middleName')
    const lastNameInput = screen.getByLabelText('Apellido')

    await user.type(firstNameInput, 'John')
    await user.type(middleNameInput, 'Paul')
    await user.type(lastNameInput, 'Doe')
    const button = screen.getByRole('button', { name: /Siguiente/i })
    await user.click(button)

    expect(nextStep).toHaveBeenCalled()
    expect(updatePersonalInformation).toHaveBeenCalled()
  })

  describe('Form validation', () => {
    it('Given a user leaving name and last name input empty, show error', async () => {
      const user = userEvent.setup()
      const nextStep = jest.fn()
      const updatePersonalInformation = jest.fn()
      const personalInformation = {
        firstName: '',
        middleName: '',
        lastName: ''
      }
  
      render(
        <PersonalInformation
          direction={1}
          nextCb={nextStep}
          personalInformation={personalInformation}
          updatePersonalInformation={updatePersonalInformation}
        />
      )

      const button = screen.getByRole('button', { name: /Siguiente/i })
      await user.click(button)

      expect(await screen.findByText('Nombre es requerido')).toBeInTheDocument()
      expect(await screen.findByText('Apellido es requerido')).toBeInTheDocument()
    })

    it('Given a user entering name and last name with less than 2 characters, show error', async () => {
      const user = userEvent.setup()
      const nextStep = jest.fn()
      const updatePersonalInformation = jest.fn()
      const personalInformation = {
        firstName: '',
        middleName: '',
        lastName: ''
      }
  
      render(
        <PersonalInformation
          direction={1}
          nextCb={nextStep}
          personalInformation={personalInformation}
          updatePersonalInformation={updatePersonalInformation}
        />
      )

      const firstNameInput = screen.getByTestId('firstName')
      const lastNameInput = screen.getByLabelText('Apellido')
      const button = screen.getByRole('button', { name: /Siguiente/i })

      await user.type(firstNameInput, 'a')
      await user.type(lastNameInput, 'a')
      await user.click(button)

      expect(await screen.findByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
      expect(await screen.findByText('El apellido debe tener al menos 2 caracteres')).toBeInTheDocument()
    })
  })
  
})
