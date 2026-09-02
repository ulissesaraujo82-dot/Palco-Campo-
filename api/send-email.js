
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, nome, evento, ingresso, quantidade, total, codigo } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'E-mail não informado' });
    }

    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Palco Campo <onboarding@resend.dev>',
        to: [email],
        subject: 'Seu pedido - Palco Campo',
        html: `
          <h2>Pedido recebido!</h2>
          <p>Olá, ${nome || 'cliente'}!</p>
          <p>Recebemos seu pedido no <strong>Palco Campo</strong>.</p>
          <p><strong>Evento:</strong> ${evento || ''}</p>
          <p><strong>Ingresso:</strong> ${ingresso || ''}</p>
          <p><strong>Quantidade:</strong> ${quantidade || ''}</p>
          <p><strong>Total:</strong> ${total || ''}</p>
          <p><strong>Código do pedido:</strong> ${codigo || ''}</p>
          <p>O pagamento via PIX ainda está aguardando confirmação.</p>
        `
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      return res.status(resposta.status).json(dados);
    }

    return res.status(200).json({
      sucesso: true,
      id: dados.id
    });

  } catch (erro) {
    return res.status(500).json({
      error: 'Erro ao enviar e-mail'
    });
  }
}
