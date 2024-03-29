import jwt, { verify } from 'jsonwebtoken';

const createAccessToken = (user) =>
  jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 600,
  });

const createRefreshToken = (user) =>
  jwt.sign(
    { userId: user.id, count: user.count },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );

export const createTokens = (user) => {
  const refreshToken = createRefreshToken(user);
  const accessToken = createAccessToken(user);

  return { refreshToken, accessToken };
};

export const validateTokens = async (req, res, models) => {
  const refreshToken = req.cookies['refresh-token'];
  const accessToken = req.cookies['access-token'];
  if (!refreshToken && !accessToken) {
    return;
  }
  try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = data.userId;
    return;
  } catch {}

  if (!refreshToken) {
    res.clearCookie('refresh-token');
    res.clearCookie('access-token');
    return;
  }

  let data;

  try {
    data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    res.clearCookie('refresh-token');
    res.clearCookie('access-token');
    return;
  }
  const user = await models.User.findOne({ where: { id: data.userId } });
  // token has been invalidated
  if (!user || user.count !== data.count) {
    res.clearCookie('refresh-token');
    res.clearCookie('access-token');
    return;
  }
  user.count = user.count + 1;
  user.save();
  const tokens = createTokens(user);
  res.cookie('refresh-token', tokens.refreshToken, {
    maxAge: 60 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });
  res.cookie('access-token', tokens.accessToken, {
    maxAge: 60 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });
  req.userId = user.id;
};
