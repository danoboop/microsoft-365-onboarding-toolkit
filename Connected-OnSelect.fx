// Add Microsoft365Onboarding through Studio's Power Automate pane first.
// Replace the demo button formula with this only after following POWER-AUTOMATE.md.
// Control names match the disconnected canvas starter.
If(
    IsBlank(Trim(txtFirst.Text)) || IsBlank(Trim(txtLast.Text)) ||
    !IsMatch(Lower(Trim(txtAlias.Text)), "[a-z0-9]+([._-][a-z0-9]+)*"),
    Notify("Enter first name, last name, and a valid alias.", NotificationType.Error),
    Set(varBusy, true);
    IfError(
        Set(varResult, Microsoft365Onboarding.Run(JSON({
            firstName: Trim(txtFirst.Text),
            lastName: Trim(txtLast.Text),
            alias: Lower(Trim(txtAlias.Text)),
            role: ddRole.Selected.Value,
            workLocation: ddLocation.Selected.Value,
            managerId: Trim(txtManager.Text)
        }, JSONFormat.Compact)));
        Set(varMessage, varResult.status & ": " & varResult.message),
        Set(varMessage, "The request did not complete. Ask an administrator to check its status before retrying.")
    );
    Set(varBusy, false)
)
