import { email } from "../../../email";
import { User } from "../../../user/User";
import { webserverModule } from "../../../webserver/WebserverModule";
import { ActivationToken } from "../ActivationToken";

interface SendEmailOfActivationToUserProps {
  user: User;
  activationToken: ActivationToken;
}

type SendEmailOfActivationToUserResponse = void;

export async function sendEmailOfActivationToUser({
  activationToken,
  user,
}: SendEmailOfActivationToUserProps): Promise<SendEmailOfActivationToUserResponse> {
  const { Webserver: webserver } = webserverModule;

  await email.send({
    from: "Ankorar <contato@ankorar.com>",
    to: user.email,
    subject: "Ative sua conta no Ankorar",
    text: `${user.name},\n\nPor favor, clique no link abaixo para ativar sua conta:\n\n${webserver.origin}/register/activate/${activationToken.id}\n\nObrigado,\nEquipe Ankorar`,
  });
}
